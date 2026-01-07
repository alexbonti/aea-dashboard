import csv
import json
import os

def clean_funding(value):
    if not value:
        return 0.0
    return float(value.replace('$', '').replace(',', ''))

def get_summary(description):
    # Take the first sentence or first 200 characters
    if not description:
        return ""
    sentences = description.split('.')
    if sentences:
        summary = sentences[0].strip()
        if len(summary) > 200:
            summary = summary[:197] + "..."
        return summary
    return description[:150]

def main():
    csv_path = "/Users/alessio/.gemini/antigravity/scratch/funding-dashboard/src/data/AEA_Full_Project_Data_Updated.csv"
    output_json_path = "/Users/alessio/.gemini/antigravity/scratch/funding-dashboard/src/data/funding_data.json"
    
    projects_by_cluster = {}
    programs_data = {}
    yearly_trends = {}
    institutions_data = {}
    total_funding = 0.0
    
    cluster_descriptions = {
        "Health & Medical Technology": "Improving human and animal health through new diagnostics, therapies, medical devices, and digital health solutions.",
        "Energy, Environment & Sustainability": "Addressing climate change, energy transition, and environmental stewardship through renewable energy, carbon capture, and circular economy.",
        "Agriculture & Food Technology": "Enhancing productivity, sustainability, and resilience in agriculture and food sectors through tech and new methods.",
        "Advanced Manufacturing & Materials": "Transforming manufacturing capabilities through additive tech, novel alloys, and advanced materials.",
        "Defence, Aerospace, & Security": "Supporting sovereign defence, aerospace, and national security through advanced materials, drones, and sensors.",
        "Digital Technology, AI, & Data Science": "Software, AI/ML, and data analytics innovations with broad applicability across sectors.",
        "Mining & Resources": "Improving efficiency, safety, and sustainability in the mining sector through exploration, safety tech, and waste recovery.",
        "Other": "Other research projects and initiatives."
    }

    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            funding = clean_funding(row['Funding'])
            year = row['Year']
            program = row['Program']
            uni = row['University']
            cluster_name = row['Category']
            title = row['Title']
            desc = row.get('Description', '')
            recipient = row.get('Recipients_Partners', '')

            total_funding += funding

            # Project object with new fields
            project_obj = {
                "title": title,
                "university": uni,
                "funding": funding,
                "summary": get_summary(desc),
                "program": program,
                "year": year,
                "recipient": recipient,
                "category": cluster_name
            }

            # Clusters
            if cluster_name not in projects_by_cluster:
                projects_by_cluster[cluster_name] = []
            projects_by_cluster[cluster_name].append(project_obj)

            # Programs
            if program not in programs_data:
                programs_data[program] = {"funding": 0.0, "projects": 0}
            programs_data[program]["funding"] += funding
            programs_data[program]["projects"] += 1

            # Yearly Trends
            if year not in yearly_trends:
                yearly_trends[year] = {"funding": 0.0, "projects": 0}
            yearly_trends[year]["funding"] += funding
            yearly_trends[year]["projects"] += 1

            # Institutions
            if uni not in institutions_data:
                institutions_data[uni] = {"funding": 0.0, "projects": 0}
            institutions_data[uni]["funding"] += funding
            institutions_data[uni]["projects"] += 1

    # Format Programs
    formatted_programs = []
    for name, stats in programs_data.items():
        avg = stats["funding"] / stats["projects"] if stats["projects"] > 0 else 0
        formatted_programs.append({
            "name": name,
            "funding": round(stats["funding"], 2),
            "projects": stats["projects"],
            "average": round(avg, 2)
        })
    formatted_programs.sort(key=lambda x: x["funding"], reverse=True)

    # Format Yearly Trends
    formatted_trends = []
    for year, stats in sorted(yearly_trends.items()):
        formatted_trends.append({
            "year": year,
            "funding": round(stats["funding"], 2),
            "projects": stats["projects"]
        })

    # Format Institutions
    formatted_institutions = []
    for name, stats in institutions_data.items():
        formatted_institutions.append({
            "name": name,
            "funding": round(stats["funding"], 2),
            "projects": stats["projects"]
        })
    formatted_institutions.sort(key=lambda x: x["funding"], reverse=True)

    # Format Clusters
    formatted_clusters = []
    for name in cluster_descriptions.keys():
        if name in projects_by_cluster:
            projects = projects_by_cluster[name]
            cluster_funding = sum(p["funding"] for p in projects)
            formatted_clusters.append({
                "name": name,
                "totalFunding": round(cluster_funding, 2),
                "projectCount": len(projects),
                "description": cluster_descriptions[name],
                "projects": sorted(projects, key=lambda x: x["funding"], reverse=True)
            })
    formatted_clusters.sort(key=lambda x: x["totalFunding"], reverse=True)

    final_json = {
        "meta": {
            "totalFunding": round(total_funding, 2),
            "title": "Australia’s Economic Accelerator (AEA): Funded Projects Overview"
        },
        "programs": formatted_programs,
        "yearlyTrends": formatted_trends,
        "institutions": formatted_institutions,
        "clusters": formatted_clusters
    }

    with open(output_json_path, 'w', encoding='utf-8') as f:
        json.dump(final_json, f, indent=2)

    print(f"Successfully updated {output_json_path}")

if __name__ == "__main__":
    main()
